from django.db import models

# Create your models here.

# class UserName(models.Model):
# 	username = models.CharField(max_length = 40, unique = True)

# 	def __str__(self):
# 		return self.username

class UserModel(models.Model):
	username = models.CharField(max_length = 40, unique = True, blank=False)
	password = models.CharField(max_length = 40, blank=False, default='')
	a_token = models.CharField(max_length = 1000, unique = True)
	r_token = models.CharField(max_length = 1000, default = '')

	def __str__(self):
		return self.username + ' : ' + self.a_token