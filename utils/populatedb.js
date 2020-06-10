const { GoogleSpreadsheet } = require("google-spreadsheet");
const { to } = require("await-to-js");
const mongoose = require("mongoose");
const ora = require("ora");
const dotEnv = require("dotenv");

dotEnv.config();

const User = require("../models/User");

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

async function accessSpreadSheet() {
  const doc = new GoogleSpreadsheet(
    `1bByA1JuYcawBhg9houYOvraBTYt22LjX8jhhDfUxVNM`
  );
  const [connectError] = await to(
    doc.useServiceAccountAuth({
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY,
    })
  );

  if (connectError) console.log(`An error occured: ${connectError.message}`);

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

  const inserting = ora(
    `Inserting records from ${doc.title} into ${User.modelName} collection`
  ).start();

  const [error, _] = await to(User.insertMany(users));

  inserting.succeed();

  if (error) {
    console.log(`🚫 An error occured while insering records`);
  } else {
    console.log(
      `✅${User.modelName} collection is now in sync with ${doc.title}!`
    );
    process.exit();
  }
}

accessSpreadSheet();
