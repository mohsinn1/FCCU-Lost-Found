from django.urls import path
from items.views import ItemListCreateView, ItemDetailView, MyItemsView, MarkClaimedView

urlpatterns = [
    path('', ItemListCreateView.as_view()),
path('my-items/', MyItemsView.as_view(), name='my-items'),
    path('<int:pk>/', ItemDetailView.as_view()),
    path('<int:pk>/mark-claimed/', MarkClaimedView.as_view(),name = 'mark-claimed'),

]


