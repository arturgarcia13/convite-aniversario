# Video protocol: from recording to timed motion spec

## 1. Intake
Run `python scripts/extract_frames.py VIDEO --out work/frames`. It writes metadata (size, fps, duration, ms per frame), scene-change frames,
uniform frames, and labeled contact sheets. View the contact sheets first to understand the whole flow, then open individual frames.
Check the video size against the device scale table in `extraction-checklist.md`. Screen recordings are often @2x or @3x with a status bar.

## 2. Static design
Pick one clean frame per distinct screen (no transition in progress, no finger/touch indicator, no keyboard animation) and treat each like an image:
run the full checklist on it. Where a screen only appears mid-scroll, stitch the extracted frames by their scroll offset and describe the full page.

## 3. Timeline
Build a table of events: start time, end time, duration in ms, trigger, what changes. Convert frame counts to ms with `ms_per_frame`.
Duration accuracy is about plus or minus one frame, so state it.

## 4. Measuring a transition
1. Find its start and end from the scene sheet, then run `extract_frames.py VIDEO --out work/t1 --window START END --fps <video fps>` to get every frame.
2. For each animated element, track one measurable property per frame: position (x, y), size, opacity (sampled color against its background), rotation, blur.
   Use `measure.py bbox` per frame and `palette.py --point` for opacity or color.
3. Normalize progress p = (value - start) / (end - start) for each frame and plot or tabulate it against time.
4. Match the curve to an easing: linear (p grows evenly), ease-in (slow start), ease-out (fast start, slow end), ease-in-out (S-curve), spring (overshoots then settles; record overshoot % and settle time),
   or a named cubic-bezier. Give the best-fit CSS `cubic-bezier(...)` or spring (stiffness/damping guess) and mark it `[I]`.
5. Stagger: delay between sibling elements starting. Orchestration: which elements move together, in what order, with what offsets.

## 5. Patterns to name explicitly
Shared-element/hero transitions, push/pop, modal sheet rise, fade-through, scale-on-press (record scale and duration), skeleton shimmer (direction, period), progress ring fill,
number count-up, parallax (ratio of foreground to background speed), sticky header collapse (scroll range and property changes), bounce/overscroll, haptic cues you can infer.

## 6. Interaction map
List each gesture seen (tap, long-press, swipe, pull-to-refresh, drag), its target element, and the resulting state change. Touch indicators in recordings mark the tap point.

## 7. Output
Fill section 10 (Motion) of the output template: timeline table, per-transition spec (property, from, to, duration, delay, easing), and loops (idle animations with period).
Also list motion that is not visible (hover, disabled, error) under Unknowns.
