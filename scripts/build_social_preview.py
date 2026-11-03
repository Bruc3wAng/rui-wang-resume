"""Compatibility entry point for the localized, script-font-aware card builder."""
import os
import subprocess
from pathlib import Path

if __name__ == "__main__":
    subprocess.run(
        [os.environ.get("RUI_NODE", "node"), str(Path(__file__).with_suffix(".mjs"))],
        check=True,
    )
