import { TestBed } from '@angular/core/testing';

import { GetBirdTrackdataService } from './get-bird-trackdata.service';

describe('GetBirdTrackdataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetBirdTrackdataService = TestBed.get(GetBirdTrackdataService);
    expect(service).toBeTruthy();
  });
});
