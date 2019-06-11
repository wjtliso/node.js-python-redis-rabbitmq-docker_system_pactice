import thumbnail
import pytest

def test_get_new_size_of_image_0_0():
    assert thumbnail.get_new_size_of_image(0, 0) == (0, 0)

def test_get_new_size_of_image_99_50():
    assert thumbnail.get_new_size_of_image(99, 50) == (99, 50)

def test_get_new_size_of_image_50_99():
    assert thumbnail.get_new_size_of_image(50, 99) == (50, 99)

def test_get_new_size_of_image_100_50():
    assert thumbnail.get_new_size_of_image(100, 50) == (100, 50)

def test_get_new_size_of_image_50_100():
    assert thumbnail.get_new_size_of_image(50, 100) == (50, 100)

def test_get_new_size_of_image_101_50():
    assert thumbnail.get_new_size_of_image(101, 50) == (100, 50)

def test_get_new_size_of_image_50_101():
    assert thumbnail.get_new_size_of_image(50, 101) == (50, 100)

def test_get_new_size_of_image_200_150():
    assert thumbnail.get_new_size_of_image(200, 150) == (100, 75)

def test_get_new_size_of_image_150_200():
    assert thumbnail.get_new_size_of_image(150, 200) == (75, 100)
