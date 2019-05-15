export interface FunctionInfo {
  name: string;
  function_app_id: string;
  script_root_path_href: string;
  script_href: string;
  config_href: string;
  secrets_file_href: string;
  href: string;
  config: FunctionConfig;
  files: { [key: string]: string };
  test_data: string;
  invoke_url_template: string;
  language: string;
}

export interface FunctionConfig {
  disabled?: boolean | string; // can be null for empty template
  bindings: FunctionBinding[];
}

export interface FunctionBinding {
  name: string;
  direction: string;
  type: string;
  path: string;
  queueName: string;
  schedule: string;
  runOnStartup: boolean;
  partitionKey: string;
  filter: string;
  tableName: string;
  rowKey: string;
  webHookType: string;
  authLevel: string;
  route: string;
  methods: string[];
  message: string;
}
