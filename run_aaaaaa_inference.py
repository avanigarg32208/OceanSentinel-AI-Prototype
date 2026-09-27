from ultralytics import YOLO
from pathlib import Path
import shutil, json, csv, time
import cv2

MODEL = Path(r"D:\17\SIH Project\SIH Project\OceanSentinel-AI\models\oil_spill_detector_final.pt")
INPUT = Path(r"D:\aaaaaa")
OUTPUT = Path(r"D:\17\OceanSentinel AI Prototype Design\aaaaaa-inference")
PUBLIC = Path(r"D:\17\OceanSentinel AI Prototype Design\public\aaaaaa-results")

OUTPUT.mkdir(parents=True, exist_ok=True)
PUBLIC.mkdir(parents=True, exist_ok=True)

images = sorted([
    p for p in INPUT.iterdir()
    if p.suffix.lower() in [".jpg", ".jpeg", ".png"]
])

print("=" * 70)
print("OCEANSENTINEL - ORIGINAL D:\\aaaaaa REAL YOLO INFERENCE")
print("=" * 70)
print("Model :", MODEL)
print("Input :", INPUT)
print("Images:", len(images))
print()

model = YOLO(str(MODEL))
all_results = []

for i, image_path in enumerate(images, 1):
    print(f"[{i:02d}/{len(images):02d}] {image_path.name}")

    start = time.perf_counter()

    results = model.predict(
        source=str(image_path),
        conf=0.25,
        imgsz=640,
        verbose=False
    )

    elapsed = time.perf_counter() - start
    result = results[0]

    annotated = result.plot()
    output_image = OUTPUT / image_path.name

    cv2.imwrite(str(output_image), annotated)
    shutil.copy2(output_image, PUBLIC / image_path.name)

    detections = []

    if result.boxes is not None and len(result.boxes) > 0:
        boxes = result.boxes

        xyxy = boxes.xyxy.cpu().tolist()
        confs = boxes.conf.cpu().tolist()
        classes = boxes.cls.cpu().tolist()

        for box, confidence, class_id in zip(xyxy, confs, classes):
            x1, y1, x2, y2 = box

            area = max(0, x2 - x1) * max(0, y2 - y1)

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
                "bbox_area_pixels": round(float(area), 2)
            })

    max_conf = max(
        [d["confidence"] for d in detections],
        default=0
    )

    total_area = sum(
        d["bbox_area_pixels"] for d in detections
    )

    record = {
        "image": image_path.name,
        "status": "OIL SPILL DETECTED" if detections else "NO OIL SPILL DETECTED",
        "detection_count": len(detections),
        "max_confidence": max_conf,
        "total_bbox_area_pixels": round(total_area, 2),
        "processing_time_seconds": round(elapsed, 3),
        "output_image": f"/aaaaaa-results/{image_path.name}",
        "detections": detections
    }

    all_results.append(record)

    if detections:
        print(
            f"      DETECTED | objects={len(detections)} | "
            f"confidence={max_conf:.2%}"
        )
    else:
        print("      NO OIL SPILL")

    print(f"      time={elapsed:.3f}s")
    print()

with open(OUTPUT / "inference_results.json", "w", encoding="utf-8") as f:
    json.dump(all_results, f, indent=2)

with open(OUTPUT / "inference_results.csv", "w", newline="", encoding="utf-8") as f:
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

detected = sum(r["detection_count"] > 0 for r in all_results)
total_detections = sum(r["detection_count"] for r in all_results)

print("=" * 70)
print("INFERENCE COMPLETE")
print("=" * 70)
print(f"Images processed : {len(all_results)}")
print(f"Images detected  : {detected}")
print(f"No spill         : {len(all_results) - detected}")
print(f"Total detections : {total_detections}")
print()
print(f"Results : {OUTPUT}")
print(f"Web     : {PUBLIC}")
print("=" * 70)
