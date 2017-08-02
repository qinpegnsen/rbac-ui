import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimittabComponent } from './limittab.component';

describe('LimittabComponent', () => {
  let component: LimittabComponent;
  let fixture: ComponentFixture<LimittabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimittabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimittabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
