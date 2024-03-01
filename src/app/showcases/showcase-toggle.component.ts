import { NgForOf, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, startWith, Subject, takeUntil } from 'rxjs';
import { LibToggleComponent } from 'shared-components';

@Component({
  standalone: true,
  selector: 'showcase-toggle',
  templateUrl: './showcase-toggle.component.html',
  imports: [ReactiveFormsModule, NgForOf, NgIf, LibToggleComponent],
})
export class ShowcaseToggleComponent implements OnInit, OnDestroy {
  toggleLabelText: string;
  toggleTooltipText: string;

  toggleLabelCtrl: FormControl = new FormControl<string>({
    value: 'Activate specific behaviour',
    disabled: false,
  });
  toggleTooltipCtrl: FormControl = new FormControl<string>({
    value: 'When activated, everything works!',
    disabled: false,
  });
  toggleCtrl: FormControl = new FormControl<boolean>({
    value: true,
    disabled: false,
  });

  private _onDestroy$ = new Subject<any>();
  ngOnInit(): void {
    const startValToggleLabel = this.toggleLabelCtrl.getRawValue();
    const startValToggleTooltip = this.toggleTooltipCtrl.getRawValue();

    combineLatest([
      this.toggleLabelCtrl.valueChanges.pipe(startWith(startValToggleLabel)),
      this.toggleTooltipCtrl.valueChanges.pipe(
        startWith(startValToggleTooltip),
      ),
    ])
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([toggleLabel, toggleTooltip]) => {
        this.toggleLabelText = toggleLabel;
        this.toggleTooltipText = toggleTooltip;
      });
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(null);
  }
}
