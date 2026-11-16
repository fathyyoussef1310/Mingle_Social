import * as mongoose from "mongoose";
import {config} from "../config/env";
mongoose.connect(config.db.url)