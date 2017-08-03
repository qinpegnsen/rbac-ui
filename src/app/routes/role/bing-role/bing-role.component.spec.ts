import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BingRoleComponent } from './bing-role.component';

describe('BingRoleComponent', () => {
  let component: BingRoleComponent;
  let fixture: ComponentFixture<BingRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BingRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BingRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
