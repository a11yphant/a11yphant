import { HelloWorldService } from "./hello-world.service"

describe('hello world', () => {
    it('returns hello world items', () => {
        const service = new HelloWorldService();
        expect(service.findAll()).toBeTruthy();
    })
});