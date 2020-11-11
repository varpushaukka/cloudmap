import unittest
import schema

class TestStringMethods(unittest.TestCase):

    def test_return_some_clouds_from_europe(self):
        self.assertTrue(schema.get_clouds_by_region("europe", schema.list_clouds()))


if __name__ == '__main__':
    unittest.main()