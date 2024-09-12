/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { ConfigService } from "@nestjs/config";
import { createConfigServiceMock } from "@tests/support/helpers";
import { Request } from "express";

import { JwtService } from "@/authentication/jwt.service";
import { StoreService } from "@/authentication/store.service";

const getStore = (): StoreService => new StoreService(createMock<JwtService>(), createMock<ConfigService>(createConfigServiceMock()));

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyOWE0M2NmZC1hNWRlLTRmMmYtYjVkMC0wYjUzMzY3MjkzMTIiLCJpYXQiOjE2MzI3NTQ4MDAsImV4cCI6MTY2NDI5MDgwMCwiaXNzIjoiYTExeXBoYW50Iiwic3ViIjoic2Vzc2lvbiJ9.YzKX5OxHOOUeoUSmKsy0pQGBAqGTqkSLSKXZn4b2MY4";

const REQ = createMock<Request>({
  cookies: {
    a11yphant_session: TOKEN,
  } as any,
});

describe("store service", () => {
  it("can store and retreive information", () => {
    const store = getStore();

    const secret = "a11yphant";
    const state = "a11y";
    const callback = jest.fn();

    store.set(REQ, "", secret, state, {}, jest.fn());
    store.get(REQ, "", callback);

    expect(callback).toHaveBeenCalledWith(null, secret, state);
  });

  it("throws an error if no entry is found", () => {
    const store = getStore();

    const callback = jest.fn();

    store.get(REQ, "", callback);

    expect(callback).toHaveBeenCalledWith(expect.any(TypeError));
  });

  it("can destroy entries", () => {
    const store = getStore();

    const callback = jest.fn();

    store.set(REQ, "", "", {}, {}, jest.fn());
    store.destroy(REQ, "", jest.fn());

    store.get(REQ, "", callback);

    expect(callback).toHaveBeenCalledWith(expect.any(TypeError));
  });
});
