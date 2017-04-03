from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator


class MyUser(AbstractUser):
	contact=models.BigIntegerField(null=True,validators=[RegexValidator(regex='^.{10}$', message='Please enter a valid contact', code='nomatch')])
	token=models.CharField(blank=False,max_length=4,default='')
	profilepic=models.ImageField("Profile Pic",upload_to="static/profilepics/",default="static/default/anonymous.jpg")
	privatekey=models.TextField(max_length=1000, default='-----BEGIN RSA PRIVATE KEY-----\nMIICXQIBAAKBgQC9EOI/GpCKmWwuSZO6ga0bt/dzHyP3+RErOkVozB+CQd70M/2R\n5593S2K1NAtid2jok1GV39DhlvGQYicwrM+RC7m39crXypmMzU+ERPGLJszRlmnL\nMtOdEIn7xGjVREu0dNomW343rZ/Asd2HowHd8leio4sjivLkQZZkIKzbPwIDAQAB\nAoGBAJCaskCLg9POBnTcp5W1iv4xVZyCS9NkdyI13lKKFOtekDT88ss+ebQXP3bS\nSIbWR7Hiwzq7RZrVBQtmVw0ej13QNGdwk0B3uZ0VxcSW8vGOC19DZIR+dY/ucMuv\nIzdhNlHq0AL1hNsMevgoZTOOlFutf1xQkz0egB4nbTb/6OeZAkEAwKGBLV7Wk2ST\n9gU8CDlr56vOuMXnZznu8uillDj/jQavsxv2mHkKor3gljOxkIpnJn0S7sSDCW7O\nveITR02PbQJBAPtDKEyEVIzr0naYf2GkTF56PkD+Bycd0+jEQ69gu+LtgWiJBsyR\nC3iQrWlsnwW8GUyHv6CtFQiq3CMVd/BxLdsCQAXepf4I7sbtAKk1fZ/OiCA2FwWA\nWk3F8ScLucfreLYGZyIxDvGUdqOA37AUASwjW4NLumD2Mfv+mWQl2GqKzX0CQQDf\nfFh31qwtvAOzIOkMPEsBLdH5lPlfvZQi0Y8yiuQTcBVOmbLGeayuTGEyCD9ZpnkK\nLSQxEkJHN1IekpXf84tJAkBXHLnHc8EFxJtY2j6iPgsaMz2oNOcS+0jvR7kHsdC7\nPKcSc2BDwdN8SSvdRTFA6J6td7afmhdqXa7kIbKRXdGR\n-----END RSA PRIVATE KEY-----')
	publickey=models.TextField(max_length=1000, default='-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9EOI/GpCKmWwuSZO6ga0bt/dz\nHyP3+RErOkVozB+CQd70M/2R5593S2K1NAtid2jok1GV39DhlvGQYicwrM+RC7m3\n9crXypmMzU+ERPGLJszRlmnLMtOdEIn7xGjVREu0dNomW343rZ/Asd2HowHd8lei\no4sjivLkQZZkIKzbPwIDAQAB\n-----END PUBLIC KEY-----')
	def __str__(self):
		return self.username


