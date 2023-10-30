import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageMaxComponent } from './image-max.component';

describe('ImageMaxComponent', () => {
  let component: ImageMaxComponent;
  let fixture: ComponentFixture<ImageMaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageMaxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageMaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
