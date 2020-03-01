import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyMgmtComponent } from './key-mgmt.component';

describe('KeyMgmtComponent', () => {
  let component: KeyMgmtComponent;
  let fixture: ComponentFixture<KeyMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
