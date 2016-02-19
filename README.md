## PDX Roasters

Find a local coffee roaster in Portland, OR.

### Getting Started

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
    $ cp src/site/pdxroasters/settings_local.py.sample src/site/pdxroasters/settings_local.py

    # Install the required libraries
    $ pip install -r src/requirements.txt

    # Create the dev database
    $ python src/site/manage.py syncdb

    # Run the development server
    $ python src/site/manage.py runserver

> Note: When the Python virtualenv is activated, you'll see your shell prompt
> change to include a prefix like `(django-pdxroasters)shin:src tristanw$`.
> You can deactivate the virtualenv by typing `deactivate`.

You should now be able to access the site in your browser by visiting
`http://localhost:8000/` and the admin page by visiting `http://localhost:8000/admin/`.

When anybody modifies the data models, you'll need to delete the `pdxroasters.db` and run `python manage.py syncdb`.

### Static Assets

After making changes to Sass or JavaScript, you'll need to compile the changes. To do this, use npm:

    $ cd site/pdxroasters/static
    $ npm install
    $ npm run build

Check-in the updated files when this process has completed.

If you'll be doing several changes, you can also watch the files and recompile whenever they change:

    $ npm start

**Note**: JavaScript source files are in `/static/js/src/` and Sass files live in `/static/sass/`. **Do not** edit the files in `/static/js/dist/` or `/static/css/` as both folders are compiled by the build, and your changes will be overwritten the next time somebody builds.

### Deploying to Heroku

To deploy the production site you need to first generate the compressed static
resources. Start by switching to the release branch:

    $ git checkout release
    $ git merge master
    $ git push heroku release:master

> Note: heroku pg:reset DATABASE

### License

Source released under the BSD 2-Clause License. See LICENSE.
