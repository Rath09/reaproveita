import bcrypt


def hash_senha(senha: str) -> str:
    """Gera o hash bcrypt de uma senha em texto puro."""
    senha_bytes = senha.encode("utf-8")
    hash_bytes = bcrypt.hashpw(senha_bytes, bcrypt.gensalt())
    return hash_bytes.decode("utf-8")


def verificar_senha(senha_plana: str, senha_hash: str) -> bool:
    """Compara senha em texto puro com o hash salvo no banco. Usado no login."""
    return bcrypt.checkpw(senha_plana.encode("utf-8"), senha_hash.encode("utf-8"))
