from django import forms
from authenticate.models import UserModel

class UserForm(forms.ModelForm):
	password = forms.CharField(widget=forms.PasswordInput)
	class Meta():
		model = UserModel
		fields = ['username','password']
		widgets = {
            'text': forms.TextInput(attrs={ 
                'required': True, 
                'placeholder': 'Say something...'
            }),
        }