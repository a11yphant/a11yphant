import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class TwitterAuthGuard extends AuthGuard("twitter") {}
