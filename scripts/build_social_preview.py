from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "work" / "social-preview-generated.png"
OUTPUT = ROOT / "public" / "social-preview.png"
GEORGIA = Path("/System/Library/Fonts/Supplemental/Georgia.ttf")
GEORGIA_BOLD = Path("/System/Library/Fonts/Supplemental/Georgia Bold.ttf")
ARIAL_UNICODE = Path("/System/Library/Fonts/Supplemental/Arial Unicode.ttf")


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size=size)


image = Image.open(SOURCE).convert("RGB")
image = image.resize((1200, 630), Image.Resampling.LANCZOS)
draw = ImageDraw.Draw(image)

navy = "#102a3c"
teal = "#2b6f72"
muted = "#566872"
brick = "#b14e37"

draw.rectangle((80, 80, 126, 84), fill=brick)
draw.text((80, 108), "RUI WANG  /  王睿", font=font(ARIAL_UNICODE, 23), fill=teal)
draw.text((78, 181), "Market &", font=font(GEORGIA, 55), fill=navy)
draw.text((78, 244), "User Research", font=font(GEORGIA, 55), fill=navy)
draw.text(
    (81, 338),
    "QUANTITATIVE RESEARCH  ·  MULTI-MARKET INSIGHTS",
    font=font(GEORGIA_BOLD, 17),
    fill=navy,
)
draw.line((80, 397, 455, 397), fill="#aeb5b3", width=1)
draw.text(
    (80, 424),
    "RESEARCH EXECUTIVE AT IPSOS  ·  BEIJING",
    font=font(GEORGIA, 15),
    fill=muted,
)
draw.text(
    (80, 522),
    "RESEARCH DESIGN  ·  ANALYTICAL DIAGNOSIS  ·  AI WORKFLOWS",
    font=font(GEORGIA, 12),
    fill=muted,
)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
image.save(OUTPUT, format="PNG", optimize=True)
print(OUTPUT)
