import project from "../utils/project";

export async function save(): Promise<void> {
	console.log("Je save");

	await project.save();
}
