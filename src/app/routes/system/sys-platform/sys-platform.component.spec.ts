import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysPlatformComponent } from './sys-platform.component';

describe('SysPlatformComponent', () => {
  let component: SysPlatformComponent;
  let fixture: ComponentFixture<SysPlatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysPlatformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
