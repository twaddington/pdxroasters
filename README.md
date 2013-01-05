## PDX Roasters

...

## Getting Started

Django is a great framework, but requires several steps to get a development
site running on your computer. If you're running OS X these instructions should
serve you well:

    # Install pip
    $ sudo easy_install pip

    # Install virtualenv
    $ sudo pip install virtualenv

    # Create a new virtual environment for the project
    $ virtualenv django-pdxroasters

    # Activate the virtual environment
    $ cd django-pdxroasters
    $ source bin/activate

    # Check out the project source
    $ git clone git@github.com:twaddington/pdxroasters.git src

    # Create a local settings file
    $ cp src/pdxroasters/pdxroasters/settings_local.py.sample src/pdxroasters/pdxroasters/settings_local.py

    # Install the required libraries
    $ pip install -r src/requirements.txt

    # Create the dev database
    $ python src/pdxroasters/manage.py syncdb

    # Run the development server
    $ python src/pdxroasters/manage.py runserver

> Note: When the Python virtualenv is activated, you'll see your shell prompt
> change to include a prefix like `(django-pdxroasters)shin:src tristanw$`.
> You can deactivate the virtualenv by typing `deactivate`.

You should now be able to access the site in your browser by visiting
`http://localhost:8000/` and the admin page by visiting `http://localhost:8000/admin/`.

## Features

...

- Submit a roaster
- Contact

## Models

### Roaster

- Name
- Address
- Hours (Mon-Fri: Open/Close, Sat: Open/Close, Sun: Open/Close)
- Phone
- Description
- URL
- Photo URL
- Video URL
- Roasts
- Cafes

### Roast

- Name
- Roaster

### Cafe

- Name
- Address
- Hours
- Phone
- URL
- Roasters
