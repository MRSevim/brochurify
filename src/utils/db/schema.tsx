import dynamoose from "./db";
import { v4 as uuidv4 } from "uuid";

const tableName = "BrochurifyTable";

const userSchema = new dynamoose.Schema({
  PK: {
    type: String,
    hashKey: true,
    required: true,
  },
  SK: {
    type: String,
    rangeKey: true,
    required: true,
  },
  type: {
    type: String,
    required: true,
    default: "user",
  },
  userId: {
    type: String,
    required: true,
    default: () => uuidv4(),
  },
  name: String,
  email: String,
  // other user fields...
});

const projectSchema = new dynamoose.Schema({
  PK: {
    type: String,
    hashKey: true,
    required: true,
  },
  SK: {
    type: String,
    rangeKey: true,
    required: true,
  },
  type: {
    type: String,
    required: true,
    default: "project",
  },
  projectId: {
    type: String,
    required: true,
    default: () => uuidv4(),
  },
  title: String,
  editorState: String, // Save your serialized JSON here
  // other project fields...
});

const UserModel = dynamoose.model(tableName, userSchema);
const ProjectModel = dynamoose.model(tableName, projectSchema);

export { UserModel, ProjectModel };
