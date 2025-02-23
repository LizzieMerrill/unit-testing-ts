import { Client } from "../src/Client";
import { Service } from "../src/Service";
import { mock, instance, when, verify, anything } from "ts-mockito";

describe("m4 integrated test", () => {
  let mockService: Service;
  let mockServiceInstance: Service;
  let client: Client;

  beforeEach(() => {
    //create a mock for the Service class
    mockService = mock(Service);
    mockServiceInstance = instance(mockService);

    //create a real Client instance
    client = new Client();
    //directly override the createService method on the client instance so that it returns the mock Service
    (client as any).createService = () => mockServiceInstance;
  });

  it("testConvertValue", () => {
    const expected: string = "70";
    //set up the mock: when getDecimalDigitCount is called with 35, return 2
    when(mockService.getDecimalDigitCount(35)).thenReturn(2);

    //call convertValue which will now use our overridden createService
    const actual: string = client.convertValue(35);
    expect(actual).toBe(expected);
  });

  it("testCreateFormattedStringsWithAnswer", () => {
    //when processList is called, then run a function to validate its argument
    when(mockService.processList(anything())).thenCall((strings: string[]) => {
      expect(strings).not.toBeNull();
      strings.forEach(s => {
        expect(s).toEqual(s.toUpperCase());
      });
    });

    const input: string = "Have a nice day";
    client.createFormattedStrings(input);

    //verify that processList was called exactly once
    verify(mockService.processList(anything())).once();
  });
});
