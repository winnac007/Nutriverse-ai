import urllib.parse
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

def create_mongo_client(uri: str):
    """Safely creates a Motor client, handling special characters in credentials."""
    try:
        return AsyncIOMotorClient(uri)
    except Exception:
        # If it fails, try to encode the password part
        if uri.startswith("mongodb") and "@" in uri:
            try:
                prefix, rest = uri.split("://", 1)
                user_pass, host_rest = rest.rsplit("@", 1)
                if ":" in user_pass:
                    user, password = user_pass.split(":", 1)
                    if any(c in password for c in ":/@#[]?"):
                        safe_pass = urllib.parse.quote_plus(password)
                        new_uri = f"{prefix}://{user}:{safe_pass}@{host_rest}"
                        return AsyncIOMotorClient(new_uri)
            except Exception:
                pass
        raise

client = create_mongo_client(settings.MONGO_URL)
db = client[settings.DB_NAME]
