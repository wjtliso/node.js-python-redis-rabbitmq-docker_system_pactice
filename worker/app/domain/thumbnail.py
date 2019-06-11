LARGEST_PIXEL = 100

def get_new_size_of_image(current_width, current_height):
    new_width = current_width
    new_height = current_height
    if current_width >= current_height :
        new_width, new_height = change_the_size(current_width, current_height)
    else:
        new_height, new_width = change_the_size(current_height, current_width)
    return new_width, new_height

def change_the_size(a, b):
    new_a = a
    new_b = b
    if a > LARGEST_PIXEL :
        new_a = LARGEST_PIXEL
        new_b = round(b / a * LARGEST_PIXEL)
    return new_a, new_b