import mysql from "mysql2/promise.js";

import { CONFIG } from "./config.js";

export const pool = mysql.createPool(CONFIG);
