import { DynamicModule } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import AWS from "aws-sdk";
import AWSMock from "aws-sdk-mock";

import { AwsMessagingModule } from "../lib/aws-messaging.module";
import { AWS_MESSAGING_MODULE_CONFIG } from "../lib/constants";

describe("AWS Messaging Module", () => {
  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
  });

  it("can instantiate the module", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AwsMessagingModule.forRootAsync({
          useFactory: () => ({
            region: "eu-central-1",
            topics: { test: "some:arn" },
          }),
        }),
        AwsMessagingModule,
      ],
    }).compile();

    expect(moduleRef).toBeTruthy();
  });

  it("provides the injected values with forRootAsync", async () => {
    const module = await AwsMessagingModule.forRootAsync({
      imports: [("module" as unknown) as DynamicModule],
      useFactory: (region: string, arn: string) => ({ region, topics: { test: arn } }),
      inject: ["eu-central-1", "some:arn"],
    });
    const moduleConfig = (module.providers?.find((provider: any) => provider.provide === AWS_MESSAGING_MODULE_CONFIG) as unknown) as any;

    expect(module.imports).toContain("module");
    expect(moduleConfig).toBeTruthy();
    expect(moduleConfig.useFactory).toBeTruthy();
    expect(moduleConfig.inject).toEqual(["eu-central-1", "some:arn"]);
  });
});
