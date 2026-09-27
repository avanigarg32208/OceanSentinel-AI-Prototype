from ultralytics import YOLO
from pathlib import Path
import json
import csv
import shutil
import time

MODEL = Path(r"D:\17\SIH Project\SIH Project\OceanSentinel-AI\models\oil_spill_detector_final.pt")
INPUT = Path(r"D:\17\OceanSentinel AI Prototype Design\yolo-input")
OUTPUT = Path(r"D:\17\OceanSentinel AI Prototype Design\yolo-inference")
PUBLIC = Path(r"D:\17\OceanSentinel AI Prototype Design\public\yolo-results-real")

OUTPUT.mkdir(parents=True, exist_ok=True)
PUBLIC.mkdir(parents=True, exist_ok=True)

print("=" * 70)
print("OCEANSENTINEL - REAL YOLO OIL SPILL INFERENCE")
print("=" * 70)

print(f"Model : {MODEL}")
print(f"Input : {INPUT}")
print(f"Output: {OUTPUT}")
print()

model = YOLO(str(MODEL))

images = sorted([
    p for p in INPUT.iterdir()
    if p.suffix.lower() in [".jpg", ".jpeg", ".png"]
])[:20]

print(f"Images found: {len(images)}")
print()

all_results = []

for index, image_path in enumerate(images, start=1):

    print(f"[{index:02d}/{len(images):02d}] Processing {image_path.name} ...")

    start = time.perf_counter()

    results = model.predict(
        source=str(image_path),
        conf=0.25,
        imgsz=640,
        verbose=False
    )

    elapsed = time.perf_counter() - start

    result = results[0]

    # Save annotated image
    annotated = result.plot()

    output_image = OUTPUT / image_path.name

    import cv2
    cv2.imwrite(str(output_image), annotated)

    # Copy final annotated image into website public folder
    public_image = PUBLIC / image_path.name
    shutil.copy2(output_image, public_image)

    detections = []

    if result.boxes is not None and len(result.boxes) > 0:

        boxes = result.boxes

        xyxy = boxes.xyxy.cpu().tolist()
        confs = boxes.conf.cpu().tolist()
        classes = boxes.cls.cpu().tolist()

        for box, confidence, class_id in zip(xyxy, confs, classes):

            x1, y1, x2, y2 = box

            bbox_width = max(0, x2 - x1)
            bbox_height = max(0, y2 - y1)
            bbox_area = bbox_width * bbox_height

            detections.append({
                "class_id": int(class_id),
                "class_name": model.names[int(class_id)],
                "confidence": round(float(confidence), 4),
                "bbox": [
                    round(float(x1), 2),
                    round(float(y1), 2),
                    round(float(x2), 2),
                    round(float(y2), 2)
                ],
                "bbox_area_pixels": round(float(bbox_area), 2)
            })

    max_confidence = (
        max([d["confidence"] for d in detections])
        if detections else 0
    )

    total_bbox_area = sum(
        d["bbox_area_pixels"] for d in detections
    )

    image_result = {
        "image": image_path.name,
        "status": "OIL SPILL DETECTED" if detections else "NO OIL SPILL DETECTED",
        "detection_count": len(detections),
        "max_confidence": max_confidence,
        "total_bbox_area_pixels": round(total_bbox_area, 2),
        "processing_time_seconds": round(elapsed, 3),
        "output_image": f"/yolo-results-real/{image_path.name}",
        "detections": detections
    }

    all_results.append(image_result)

    if detections:
        print(
            f"      DETECTED: {len(detections)} | "
            f"Confidence: {max_confidence:.2%}"
        )
    else:
        print("      NO OIL SPILL DETECTED")

    print(f"      Time: {elapsed:.3f}s")
    print()

# JSON output
json_path = OUTPUT / "inference_results.json"

with open(json_path, "w", encoding="utf-8") as f:
    json.dump(all_results, f, indent=2)

# CSV output
csv_path = OUTPUT / "inference_results.csv"

with open(csv_path, "w", newline="", encoding="utf-8") as f:

    writer = csv.writer(f)

    writer.writerow([
        "image",
        "status",
        "detection_count",
        "max_confidence",
        "total_bbox_area_pixels",
        "processing_time_seconds",
        "output_image"
    ])

    for r in all_results:

        writer.writerow([
            r["image"],
            r["status"],
            r["detection_count"],
            r["max_confidence"],
            r["total_bbox_area_pixels"],
            r["processing_time_seconds"],
            r["output_image"]
        ])

print("=" * 70)
print("INFERENCE COMPLETE")
print("=" * 70)

print(f"Annotated images : {PUBLIC}")
print(f"JSON results     : {json_path}")
print(f"CSV results      : {csv_path}")

detected = sum(
    1 for r in all_results
    if r["detection_count"] > 0
)

print()
print(f"Total images     : {len(all_results)}")
print(f"Spill detected   : {detected}")
print(f"No spill         : {len(all_results) - detected}")
print("=" * 70)
