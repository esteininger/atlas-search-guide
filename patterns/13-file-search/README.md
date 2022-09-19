# Text Search of PDF files in S3 bucket(s) using Tika and Atlas Search

Using Tika and Atlas Search to search the contents of PDF files across S3 bucket(s)


### Installation

App dependencies:
```python
pip install -r requirements.txt
```

### Setup

- Add your AWS keys, Atlas Keys and MongoDB credentials to `config.py`
- Provide the filename you want to search in `insert.py`'s variable: `s3_file_name`

### Run
1. Create the index by running `python insert.py create_index`
2. Download the file, extract the contents then insert it into Atlas Search via `python insert.py download_file`
3. Run the app via `python app.py`
4. Issue your file search queries by calling `GET HTTP localhost:5011/search?q=sample`
