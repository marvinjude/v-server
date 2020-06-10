const { GoogleSpreadsheet } = require("google-spreadsheet");
const { to } = require("await-to-js");
const mongoose = require("mongoose");
const ora = require("ora");
const dotEnv = require("dotenv");
const _chunk = require("lodash.chunk");

dotEnv.config();

const User = require("../models/User");

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

async function populatedb() {
  const doc = new GoogleSpreadsheet(
    `1bByA1JuYcawBhg9houYOvraBTYt22LjX8jhhDfUxVNM`
  );
  const [connectError] = await to(
    doc.useServiceAccountAuth({
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY.replace(/\\n/gm, "\n"),
    })
  );

  const [deleteError] = await to(User.deleteMany({}));

  if (deleteError) {
    console.log(
      `An error occured while deleting previous entries: ${connectError.message}`
    );
    return;
  }

  if (connectError) {
    console.log(`An error occured: ${connectError.message}`);
    return;
  }

  await doc.loadInfo();

  const fetching = ora(
    `Fetching rows from ${doc.title} file on Google`
  ).start();

  const rows = await doc.sheetsByIndex[0].getRows();

  fetching.succeed();

  const mapping = ora(`Mapping data`).start();

  const users = rows.map(
    ({
      first_name,
      last_name,
      email,
      country,
      car_model_year,
      car_color,
      gender,
      job_title,
      bio,
    }) => ({
      first_name,
      last_name,
      email,
      country,
      car_model_year,
      car_color,
      gender,
      job_title,
      bio,
    })
  );

  mapping.succeed();

  const chunkifying = ora(`Broken down into chunks`).start();

  const chunks = _chunk(users, 2000);

  chunkifying.succeed();

  for (let i = 0; i <= chunks.length; i++) {
    const chunkInserting = ora(
      `Inserting chunk ${i} of ${chunks.length} chunks`
    ).start();

    const [error, _] = await to(User.insertMany(chunks[i]));

    if (error) {
      chunkInserting.fail();
    } else {
      chunkInserting.succeed();
    }
  }

  console.log(
    `✅${User.modelName} collection is now in sync with ${doc.title}!`
  );

  process.exit();
}

populatedb();
