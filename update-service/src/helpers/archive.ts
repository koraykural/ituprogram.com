import { ArchiveSchema, ClassSchema } from "../config/mongo";

export const archiveCurrent = async (term: string) => {
  const allClasses = await ClassSchema.find({});
  let objects = [];

  for (let i = 0; i < allClasses.length; i++) {
    const thisClass = allClasses[i];
    delete thisClass.credits;
    const codeLetter = thisClass.code.substring(0, thisClass.code.indexOf(" "));

    const index = objects.findIndex((x) => x.codeLetter === codeLetter);

    if (index < 0) {
      objects.push({
        codeLetter,
        classes: [thisClass],
      });
    } else {
      objects[index].classes.push(thisClass);
    }
  }

  for (let i = 0; i < objects.length; i++) {
    const { codeLetter, classes } = objects[i];

    // Create mongoose model
    const model = new ArchiveSchema({ term, codeLetter, classes });

    // Save to DB
    await model.save((err, doc) => {
      if (err) console.log(err);
      console.log(`${codeLetter} saved: ${classes.length} classes.`);
    });
  }

  await new Promise((r) => setTimeout(r, 15000)); // Sleep
};
