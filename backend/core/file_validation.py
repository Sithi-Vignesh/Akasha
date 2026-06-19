# backend/core/file_validation.py
import zipfile
import io

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB, matches frontend

PDF_SIGNATURE = b"%PDF-"
ZIP_SIGNATURE = b"PK\x03\x04"
DOCX_INTERNAL_MARKER = "word/document.xml"


def validate_file_type(file_bytes: bytes) -> str | None:
    """
    Returns None if the file is a valid PDF or DOCX.
    Returns an error message string if invalid.
    """
    if len(file_bytes) == 0:
        return "The uploaded file is empty."

    if len(file_bytes) > MAX_FILE_SIZE:
        return "File exceeds the 10MB limit."

    # Check PDF signature
    if file_bytes[:5] == PDF_SIGNATURE:
        return None

    # Check ZIP signature (DOCX is a ZIP under the hood)
    if file_bytes[:4] == ZIP_SIGNATURE:
        try:
            with zipfile.ZipFile(io.BytesIO(file_bytes)) as zf:
                if DOCX_INTERNAL_MARKER in zf.namelist():
                    return None
                else:
                    return "This ZIP-based file isn't a valid Word document."
        except zipfile.BadZipFile:
            return "The file claims to be a ZIP/DOCX but is corrupted."

    return "Only PDF and DOCX files are supported."