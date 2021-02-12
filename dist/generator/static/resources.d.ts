export interface TemplateStructureInterface {
    template: string;
    path: string;
    name: string;
}
export declare function getEntityNaming(entity: string): {
    classPrefixName: any;
    filePrefixName: string;
    entity: string;
};
export declare function resources(entity: string): TemplateStructureInterface[];
