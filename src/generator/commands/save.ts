import project from "../utils/project";

export async function save(): Promise<void> {
	await project.save();
}
