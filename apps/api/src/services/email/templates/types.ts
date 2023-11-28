export interface EmailTemplate {
	generate(): Promise<string>;
}
