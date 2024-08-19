export type BlockConfigurationType = 'capture' | 'display';
export interface BlockConfiguration {
  id: string;
  external_id: string;
  name: string;
  version: string;
  published_at: string;
  captured_by: string;
  template_key: string;
  type: BlockConfigurationType;
  default_pair_configuration_id: string;
}
