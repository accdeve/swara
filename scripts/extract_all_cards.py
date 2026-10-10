#!/usr/bin/env python3
import os
import glob
import numpy as np
from PIL import Image
from collections import deque

RAW_DIR = "public/assets/cards/raw_hd"
OUT_DIR = "public/assets/cards"

os.makedirs(OUT_DIR, exist_ok=True)

def flood_fill_card(im, x_range, y_range, pad=80):
    W_orig, H_orig = im.size
    x0 = max(0, x_range[0] - pad)
    x1 = min(W_orig, x_range[1] + pad)
    y0 = max(0, y_range[0] - pad)
    y1 = min(H_orig, y_range[1] + pad)
    
    crop = im.crop((x0, y0, x1, y1)).convert('RGBA')
    arr = np.array(crop)
    H, W = arr.shape[:2]
    
    # Border pixels: R < 75, G < 75, B < 75, Alpha > 100
    is_border = (arr[:, :, 0] < 75) & (arr[:, :, 1] < 75) & (arr[:, :, 2] < 75) & (arr[:, :, 3] > 100)
    
    outside = np.zeros((H, W), dtype=bool)
    queue = deque()
    
    for x in range(W):
        if not is_border[0, x]:
            outside[0, x] = True
            queue.append((0, x))
        if not is_border[H - 1, x]:
            outside[H - 1, x] = True
            queue.append((H - 1, x))
    for y in range(H):
        if not is_border[y, 0]:
            outside[y, 0] = True
            queue.append((y, 0))
        if not is_border[y, W - 1]:
            outside[y, W - 1] = True
            queue.append((y, W - 1))
            
    while queue:
        cy, cx = queue.popleft()
        for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < H and 0 <= nx < W:
                if not outside[ny, nx] and not is_border[ny, nx]:
                    outside[ny, nx] = True
                    queue.append((ny, nx))
                    
    arr[outside, 3] = 0
    non_zero_y, non_zero_x = np.where(arr[:, :, 3] > 0)
    tight = arr[non_zero_y.min():non_zero_y.max()+1, non_zero_x.min():non_zero_x.max()+1]
    return Image.fromarray(tight)

def main():
    print("Extracting HD cards...")
    
    # 1. Extract Blue Back Cover from Page 1 / 2
    raw_p1 = Image.open(os.path.join(RAW_DIR, "raw_page_01.png"))
    blue_back = flood_fill_card(raw_p1, (3150, 4980), (150, 3110))
    blue_back_path = os.path.join(OUT_DIR, "card_blue_back.png")
    blue_back.save(blue_back_path)
    print(f"Saved: {blue_back_path} (size: {blue_back.size})")

    # 2. Extract Yellow Back Cover from Page 11
    raw_p11 = Image.open(os.path.join(RAW_DIR, "raw_page_11.png"))
    yellow_back = flood_fill_card(raw_p11, (3150, 4980), (150, 3110))
    yellow_back_path = os.path.join(OUT_DIR, "card_yellow_back.png")
    yellow_back.save(yellow_back_path)
    print(f"Saved: {yellow_back_path} (size: {yellow_back.size})")

    # 3. Extract Front Illustration Cards #1 through #10 (Pages 1 to 10)
    for i in range(1, 11):
        raw_path = os.path.join(RAW_DIR, f"raw_page_{i:02d}.png")
        if not os.path.exists(raw_path):
            print(f"Warning: {raw_path} not found")
            continue
        im = Image.open(raw_path)
        front_card = flood_fill_card(im, (750, 2580), (120, 3090))
        front_path = os.path.join(OUT_DIR, f"card_{i:02d}_front.png")
        front_card.save(front_path)
        
        # Also save corresponding back cover
        back_path = os.path.join(OUT_DIR, f"card_{i:02d}_back.png")
        blue_back.save(back_path)
        print(f"Saved: {front_path} (size: {front_card.size})")

    # 4. Extract Educational Cards #1 through #10 (Pages 11 to 20)
    for i in range(1, 11):
        page_idx = 10 + i
        raw_path = os.path.join(RAW_DIR, f"raw_page_{page_idx:02d}.png")
        if not os.path.exists(raw_path):
            print(f"Warning: {raw_path} not found")
            continue
        im = Image.open(raw_path)
        edu_card = flood_fill_card(im, (750, 2580), (120, 3090))
        edu_path = os.path.join(OUT_DIR, f"card_{i:02d}_edu.png")
        edu_card.save(edu_path)
        print(f"Saved: {edu_path} (size: {edu_card.size})")

    print("\nAll HD cards successfully extracted!")

if __name__ == "__main__":
    main()
