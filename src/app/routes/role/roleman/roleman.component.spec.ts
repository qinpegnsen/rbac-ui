import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolemanComponent } from './roleman.component';

describe('RolemanComponent', () => {
  let component: RolemanComponent;
  let fixture: ComponentFixture<RolemanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolemanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolemanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
