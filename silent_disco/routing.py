from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import lobby.routing

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket' : AuthMiddlewareStack(URLRouter(lobby.routing.websocket_urlpatterns))
})