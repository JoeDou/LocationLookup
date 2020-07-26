export default class AddressHandler {
  constructor(mapService) {
    this.mapService = mapService;
  }

  addressLookup(address) {
    return this.mapService.request(address);
  }
}
