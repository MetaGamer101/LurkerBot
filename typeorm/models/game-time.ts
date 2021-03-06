import { Entity, PrimaryGeneratedColumn, Column, Generated, ManyToOne } from "typeorm";
import { DiscordDBUser } from "./discord-db-user";

@Entity()
export class GameTime {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("int")
    secondsPlayed: number;

    @Column("datetime")
    sessionEndDate: Date;

    @Column("varchar")
    gameName: string;

    @ManyToOne(type => DiscordDBUser, discordUser => discordUser.gameTimes)
    discordUser: DiscordDBUser;
}
