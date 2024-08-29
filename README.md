# React - Node.js Blocks integration POC

## How to run

To run both the Frontend and Backend, run
```bash
npm start
```

To run the Backend only
```bash
npm run dev -w backend 
```

To run the Frontend only
```bash
npm run dev -w frontend 
```

## How to integrate Blocks in your application

### Backend required endpoints

It is required to have some endpoints implemented for the Blocks widget to work as they're called from within the widget.
Those endpoints have all been implemented in the current Node.js backend. You can use the code from the [backend folder](https://github.com/big-picture-medical/blocks-react-poc/tree/main/backend) as an example.

#### Authentication

All requests to Atlas need to be authenticated using a Bearer token in the request header. To get the token, make the following request

```ts
{
  method: 'POST',
  uri: `${atlasUrl}/oauth/token`,
  form: {
    client_id: ATLAS_CLIENT_UD, 
    client_secret: ATLAS_CLIENT_SECRET,
    grant_type: 'client_credentials'
  }
}
```

The payload needs to be sent as form data.
The response will contain the access_token that you can use in your requests.

```ts
{
  headers: {
    Authentication: `Bearer ${response.access_token}`
  }
}
```

#### Create EHR

In your API, you need to define a `POST /create-ehr` endpoint.
It should execute the `blocks-create-ehr` Atlas workflow with the `subjectId` in the body. The subjectId used will be the widget's patientId property.
It should return the response as a JSON object.

```ts
{
  method: 'POST',
  uri: `${atlasUrl}/execute-workflow/blocks-create-ehr`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`
  },
  body: JSON.stringify({ subjectId })
}
```

#### Get block configuration

In your API, you need to define a `POST /blocks` endpoint.
It should execute the `blocks-get-block-configuration` Atlas workflow with the `id` and `version` of the block configuration in the body.
It should return the response as a JSON object.

```ts
{
  method: 'POST',
  uri: `${atlasUrl}/execute-workflow/blocks-get-block-configuration`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`
  },
  body: JSON.stringify({ id, version })
}
```

#### Get composition

In your API, you need to define a `GET /compositions` endpoint that supports the following queryParams:
- `compositionId`
- `compositionType`
- `ehrId`
- `templateId`

It should execute the `blocks-get-ehr-composition` Atlas workflow sending in the request's body all the existent supported queryParams.

It should return the response as a JSON object.

```ts
{
  method: 'POST',
  uri: `${atlasUrl}/execute-workflow/blocks-get-ehr-composition`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`
  },
  body: JSON.stringify({ compositionId, compositionType, ehrId, templateId })
}
```

#### Submit composition

In your API, you need to define a `POST /compositions/submit` endpoint.
It should execute the `blocks-submit-composition` Atlas workflow with the `ehrId`, `composition`, `blockConfigurationId` and `templateId`.
It should return the response as a JSON object.

```ts
{
  method: 'POST',
  uri: `${atlasUrl}/execute-workflow/blocks-submit-composition`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`
  },
  body: JSON.stringify({ ehrId, composition, blockConfigurationId, templateId })
}
```

#### (WIP) - Validate composition

In your API, you need to define a `POST /compositions/validate` endpoint.

#### Terminology

In your API, you need to define a `POST /terminology` endpoint.
It should execute the `blocks-external-terminology-search` Atlas workflow with the query params received from the widget.
It should return the response as a JSON object.

```ts
{
  method: 'POST',
  uri: `${atlasUrl}/execute-workflow/blocks-external-terminology-search`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`
  },
  body: JSON.stringify(query)
}
```

### Frontend implementation

Once all required endpoints are implemented, we need to import Vue and the widget in the [index.html](https://github.com/big-picture-medical/blocks-react-poc/blob/main/frontend/index.html#L8) head tag.

```html
<!--index.html - replace the WIDGET_URL-->
<head>
    <script src="//unpkg.com/vue@3/dist/vue.global.prod.js"></script>
    <script src="WIDGET_URL/widgets/blocks/latest/block-renderer-widget.iife.js"></script>
</head>
```

Once this has been implemented, `window.BlockRendererWidget` will be defined in your application. To display a block, you will have to initialise it.

Create an element in your DOM where you want the block to be rendered.
```html
<div id="clinical-block"></div>
```

In your JavaScript, you can then call the `init` method. This will get the required data and render the block. 

```js
// This returns the block instance
const block = window.BlockRendererWidget.init('#clinical-block', {
  // Required properties
  // Your Backend URL
  apiUrl: 'http://localhost:4000',
  // The ID of the block configuration
  blockConfigurationId: '9cc73000-bc89-460f-9d49-115f8121fa86',
  // UUID of the patient
  patientId: '80d2d72b-4818-4325-9bdf-98011c7c6b20',
  // Semantic version of the block configuration
  blockConfigurationVersion: '1.0.0',
  // The template id of the block. This can be found in the web template
  blockTemplateId: 'bpm_presenting_complaint_clinician',
  // Information about the user who enters the data
  composer: {
    id: `blocks-test-page`,
    id_scheme: 'UUID',
    id_namespace: 'block-builder-test-page',
    name: 'BlockBuilder TestPage',
  },
  
  // Optional properties
  // If rehydrating existing data
  compositionId: '9cc73000-bc89-460f-9d49-115f8121fa82',
  // This will be passed into the requests
  apiRequestOptions: {
    headers: {
      authorization: 'bearer ey....'
    }
  },
  // Sets the context setting in the composition (options are defined in https://specifications.openehr.org/releases/TERM/latest/SupportTerminology.html#_setting)
  contextSettingCode: 228,
  // Language, defaults to "en". Use ISO 639-2 language code
  language: 'en',
  // Territory, defaults to "AU". Use ISO 3166-1 alpha-2 codes
  territory: 'AU',
  onReady: () => {
    // This method is called when the block successfully rendered
    console.log('mounted');
  },
  onError: (error) => {
    // This method is called when the block failed to render
    console.error(error);
  },
  onChange: (composition) => document.getElementById('composition').innerHTML = JSON.stringify(composition, null, 2),
  // Health care facility information
  healthCareFacility: {
    //at least one of the following
    name: '',
    identifiers: [
      {
        id: 'identifier-id',
        type: '',
        issuer: '',
        assigner: '',
      }
    ],
    external_ref: {
      id: 'external ref id', 
      id_scheme: '',
      namespace: 'externla ref name space'
    }
  },
  // Add more context
  bigPictureMedicalContext: {
    interaction: {
      episode_of_care: {
        id: 'episode-pf-care-id',
        type: '',
        issuer: '',
        assigner: '',
      },
      touchpoint: {
        id: 'touchpoint-id',
        type: '',
        issuer: '',
        assigner: '',
      }
    },
    clinical_block: {
      clinical_block: {
        id: 'block-key',
        type: '',
        issuer: '',
        assigner: '',
      },
      clinical_block_version: '1.0.0'
    }
  }
})
```

The block should be rendered in the selector you've added as first parameter of the init function. With the block instance you can use the following functions

```js
// Saves the composition into EHRBase using the "apiUrl/compositions/submit" endpoint.
// Returns a promise with the composition id and data
block.save();

// Validate the composition using the "apiUrl/compositions/validate" endpoint
block.validate();

// Sets the value of the composition
block.setComposition(composition);

// Sets the language
block.setLanguage('fr');
```
#### Widget properties

| Property                            | Values   | Details                                                                                                                                                     |
|-------------------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| apiUrl                              | string   | This is the url of your server that calls Atlas                                                                                                             |
| patientId                           | uuid     | Patient ID. This is used to create or get the EHR ID of the patient to link the data to them.                                                               |
| blockConfigurationId                | uuid     | ID of the block configuration.                                                                                                                              |
| blockConfigurationVersion           | string   | Version of the configuration of the block we use.                                                                                                           |
| blockTemplateId                     | string   | ID of the template of the block we want to display.                                                                                                         |
| composer                            | object   | Information about the person who was primarily responsible for the content of the Composition                                                               |
| compositionId (optional)            | uuid     | Composition ID used to rehydrate the component's data.                                                                                                      |
| apiRequestOptions (optional)        | object   | Parameters used in every request made from the widget.                                                                                                      |
| language (default: 'en')            | string   | Set the language used to render the block. This will be saved in the composition.                                                                           |
| territory (default: 'AU')           | string   | Set the territory. This will be saved in the composition.                                                                                                   |
| contextSettingCode (default: 228)   | number   | Set the context setting in the composition. options are defined in https://specifications.openehr.org/releases/TERM/latest/SupportTerminology.html#_setting |
| healthCareFacility (optional)       | object   | Set the health care facility information in the composition's context.                                                                                      |
| bigPictureMedicalContext (optional) | object   |                                                                                                                                                             |
| onReady (optional)                  | function | Function called when the widget has been successfully rendered.                                                                                             |
| onError (optional)                  | function | Function called when there is an error.                                                                                                                     |
| onChange (optional)                 | function | Function called when the composition changes.                                                                                                               |

#### Widget functions

```ts
// Saves the composition into EHRBase using the "apiUrl/compositions/submit" endpoint.
// Returns a promise with the composition id and data
save: () => Promise<'The block was not available to submit' | {
  message: 'Block failed local validation';
  errors: Record<AQLPath, Record<CompositionPath, string[]>>;
  cleanComposition: IComposition;
  rawComposition: IComposition;
} | {
  id: string;
  data: IComposition;
} | {
  message: 'Block failed remote validation';
  errors: any;
}>;

// Validate the composition using the "apiUrl/compositions/validate" endpoint
validate: () => Promise<'The block was not available to validate' | 'An error occurred while validating the block' | {
  message: 'Block failed local validation';
  errors: Record<AQLPath, Record<CompositionPath, string[]>>;
  cleanComposition: IComposition;
  rawComposition: IComposition;
} | {
  success: boolean;
  message: string;
  errors: any;
}>;
// Sets the composition
setComposition: (composition: IComposition) => void;
// Sets the language
setLanguage: (language: string) => void;
```
