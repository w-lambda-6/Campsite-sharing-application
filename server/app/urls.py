from django.urls import path
from . import apps

# /api/{app.urls}
urlpatterns = [
    path('/campList', apps.campList, name = 'campList'),
    path('/detail', apps.detail, name='detail'),
    path('/comments', apps.comments, name = 'comments'),
    path('/comment/add', apps.commentAdd, name = 'commentAdd'),
    path('/upload', apps.upload, name = 'upload'),
    path('/file', apps.file, name = 'file'),
    path('/camp/add', apps.campAdd, name = 'campAdd'),
]