from django.db import models

class LobbyModel(models.Model):
	lobbyname = models.CharField(max_length=100, unique=True)

	def __str__(self):
		return self.lobbyname
