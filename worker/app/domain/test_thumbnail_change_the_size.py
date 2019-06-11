import thumbnail
import pytest

def test_change_the_size_0_0():
    assert thumbnail.change_the_size(0, 0) == (0, 0)

def test_change_the_size_99_50():
    assert thumbnail.change_the_size(99, 50) == (99, 50)

def test_change_the_size_100_50():
    assert thumbnail.change_the_size(100, 50) == (100, 50)

def test_change_the_size_101_50():
    assert thumbnail.change_the_size(101, 50) == (100, 50)

def test_change_the_size_200_150():
    assert thumbnail.change_the_size(200, 150) == (100, 75)
