import logging
import sys
import traceback

from rotkehlchen.errors.misc import DBSchemaError, SystemPermissionError
from rotkehlchen.logging import RotkehlchenLogsAdapter
from rotkehlchen.server import RotkehlchenServer

def main() -> None:
    try:
        rotkehlchen_server = RotkehlchenServer()
    except (SystemPermissionError, DBSchemaError, SystemExit) as e:
        print(f'ERROR at initialization: {e!s}')
        sys.exit(get_exit_code(e))
    except Exception:
        tb = traceback.format_exc()
        logging.critical(tb)
        print(f'Failed to start rotki backend:\n{tb}')
        sys.exit(1)

    rotkehlchen_server.main()

def get_exit_code(e):
    return e.code if e.code is not None and e.code in {0, 2} else 1

if __name__ == '__main__':
    main()
