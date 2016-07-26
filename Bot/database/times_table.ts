﻿import {User} from "discord.js";
import * as mysql from "mysql";

import connection from "../database/connection";
import * as UserMethods from "../tools/user_methods";
import * as _ from "lodash";

// The Times table to store the times.
connection.query(`
    CREATE TABLE IF NOT EXISTS Immutable.Times (
        id          VARCHAR(25) NOT NULL,
        endTime     DATETIME    NOT NULL    DEFAULT CURRENT_TIMESTAMP,
        gameName    VARCHAR(45) NOT NULL,
        duration    INT(6)      NOT NULL
    ) CHARACTER SET utf8 COLLATE utf8_unicode_ci`
);

/**
 * Write a new entry into the Times table.
 * @param user
 * @param duration
 */
export function writeNewTimeRow(user: User, duration: number) {
    const game = UserMethods.getGameName(user);

    const stmt = `INSERT INTO Immutable.Times (id, gameName, duration) VALUES (${user.id}, ?, ${duration})`;
    const prepared = mysql.format(stmt, [game]);
    
    connection.query(prepared, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log(`Saving stats for ${UserMethods.getUniqueUsername(user)} playing ${game} for ${duration}`);
    });
}

/**
 * Get the sum of the duration of all the users passed into the function.
 * @param users
 */
export function getDurationSum(users: Array<User>, callback: (results: any) => any) {
    const userIds = users.map(user => user.id);
    const idString = _.join(userIds, ", ");

    const stmt = `SELECT gameName AS name, SUM(duration) AS duration FROM Immutable.Times WHERE ID in (${idString}) GROUP BY gameName`;

    connection.query(stmt, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }

        callback(results);
    });
}