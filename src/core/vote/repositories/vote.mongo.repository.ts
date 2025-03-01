import { InjectModel } from "@nestjs/mongoose";
import { CreateVoteDto } from "../dto/create-vote.dto";
import { Vote } from "../entities/vote.entity";
import { VoteRepository } from "./vote.repository";
import { Model } from "mongoose";
import { VoteResult } from "../../../shared/interfaces/vote-result";

export class MongoVoteRepository implements VoteRepository {
  public constructor(
    @InjectModel("Vote") private readonly voteModel: Model<Vote>,
  ) {}

  public async create(createVoteDto: CreateVoteDto): Promise<Vote> {
    return await this.voteModel.create(createVoteDto);
  }

  public async getResult(group: string): Promise<VoteResult> {
    return (
      await this.voteModel.aggregate<VoteResult>([
        {
          $addFields: {
            groupObjectId: { $toObjectId: group },
          },
        },
        {
          $lookup: {
            from: "groups",
            localField: "groupObjectId",
            foreignField: "_id",
            as: "group",
            pipeline: [{ $project: { name: 1 } }],
          },
        },
        { $unwind: "$group" },
        {
          $lookup: {
            from: "participants",
            let: {
              gIdString: { $toString: "$group._id" },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$group", "$$gIdString"],
                  },
                },
              },
              { $project: { name: 1, group: 1 } },
            ],
            as: "participant",
          },
        },
        { $unwind: "$participant" },
        {
          $lookup: {
            from: "votes",
            let: {
              pIdString: { $toString: "$participant._id" },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$participant", "$$pIdString"],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                },
              },
            ],
            as: "votes",
          },
        },
        {
          $addFields: {
            votesCount: { $size: "$votes" },
          },
        },
        {
          $group: {
            _id: "$participant._id",
            group: { $first: "$group" },
            name: { $first: "$participant.name" },
            votes: { $first: "$votesCount" },
          },
        },
        {
          $group: {
            _id: "$group",
            participants: {
              $push: {
                name: "$name",
                votes: "$votes",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            group: "$_id",
            participants: {
              $sortArray: {
                input: "$participants",
                sortBy: { votes: -1, name: 1 },
              },
            },
          },
        },
      ])
    )[0];
  }
}
